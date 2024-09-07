'use client';

import { useLayoutEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import ProgressHeading from './progress-heading';
import { useForm } from 'react-hook-form';
import { PhoneBodyType, phoneSchema } from '@/schema-validations/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

const Step7 = () => {
  const [count, setCount] = useState(0);
  const form = useForm<PhoneBodyType>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
      otp: '',
    },
  });

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      if (count > 0) {
        setCount((prev) => --prev);
      }
    }, 1_000);

    return () => clearTimeout(timer);
  }, [count]);

  const onSubmit = (values: PhoneBodyType) => {
    console.log(values);
  };

  const handleSendOtp = async () => {
    const result = await form.trigger('phone');
    if (result) {
      // TODO: Send OTP
      setCount(60);
      console.log('Send OTP');
    }
  };

  return (
    <div className="space-y-10">
      <ProgressHeading step={7} title="Thêm số điện thoại để nhận thông báo khi bạn có lời đề nghị" />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="phone">Số điện thoại</Label>
                <FormControl>
                  <Input
                    id="phone"
                    type="tel"
                    className="w-full"
                    placeholder="Số điện thoại"
                    endAdornment={
                      <Button
                        type="button"
                        variant="foreground"
                        size="small"
                        onClick={handleSendOtp}
                        disabled={count > 0}
                      >
                        Gửi mã{!!count && ` (${count})`}
                      </Button>
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="otp">OTP</Label>
                <FormControl>
                  <InputOTP id="otp" maxLength={6} {...field} containerClassName="justify-center">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPGroup key={index}>
                        <InputOTPSlot index={index} className="size-16" />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="large" variant="gradient" fullWidth className="col-span-full">
            Hoàn thành
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Step7;
