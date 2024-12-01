'use client';

import Table, { TableRef } from '@/components/custom/data-table';
import { columns, filters } from './columns';
import { ColumnDef } from '@tanstack/react-table';
import { IPaymentManagement } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { EPaymentStatus, EPaymentType } from '@/types/enum';
import { paymentRequest } from '@/request';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMemo, useRef, useState } from 'react';
import QRDialog from './qr-dialog';
import { emitter } from '@/lib/utils';

const PaymentTable = () => {
  const [payment, setPayment] = useState<IPaymentManagement>();
  const [qr, setQr] = useState<string>();
  const flag = useRef(true);
  const tableRef = useRef<TableRef>(null);

  const columnsWithActions: ColumnDef<IPaymentManagement, IPaymentManagement>[] = useMemo(
    () => [
      ...columns,
      {
        id: 'actions',
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <>
              {payment.status === EPaymentStatus.Pending && payment.type === EPaymentType.WithDraw && (
                <div className="text-center">
                  <DialogTrigger asChild>
                    <Button variant="outline" size="small" onClick={() => handleWithdraw(payment)}>
                      Thanh toán
                    </Button>
                  </DialogTrigger>
                </div>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleWithdraw = (payment: IPaymentManagement) => {
    if (flag.current) {
      flag.current = false;
      paymentRequest
        .withdrawQr(payment.id)
        .then((res) => {
          if (res.data) {
            setPayment(payment);
            setQr(res.data);
          }
        })
        .catch((err) => err?.message)
        .finally(() => (flag.current = true));
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      emitter.confirm({
        callback: () => {
          setPayment(undefined);
          setQr(undefined);
        },
        content: 'Bạn có chắc không thực hiện thanh toán sau khi tắt đi?',
      });
    }
  };

  const handleWithdrawSuccess = () => {
    setPayment(undefined);
    setQr(undefined);
    tableRef.current?.reload();
  };

  return (
    <Dialog open={!!qr} onOpenChange={handleClose}>
      <Table
        url="/Payment"
        columns={columnsWithActions}
        filters={filters}
        ref={tableRef}
        defaultSorting={[{ id: 'createdAt', desc: true }]}
      />
      {payment && qr && (
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogTitle>Yêu cẩu rút tiền của {payment.user.name}</DialogTitle>
          <DialogDescription>VUI LÒNG KHÔNG TẮT ĐI KHI ĐANG THỰC HIỆN THANH TOÁN</DialogDescription>
          <QRDialog payment={payment} qr={qr} onSuccess={handleWithdrawSuccess} />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default PaymentTable;
