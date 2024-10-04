import IInfluencer from '@/types/influencer';
import { KeyedMutator } from 'swr/_internal';

interface DetailStepProps {
  profile: IInfluencer;
  mutate: KeyedMutator<IInfluencer>;
}

export default DetailStepProps;