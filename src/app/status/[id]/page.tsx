import StatusDetails from '@/components/StatusDetails/StatusDetails';
import { StatusPageProps } from './types';

export default function Page({ params }: StatusPageProps) {
  return (
    <main>
      <StatusDetails id={params.id} />
    </main>
  );
}
