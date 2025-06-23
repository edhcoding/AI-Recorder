import { type ReactElement, type ReactNode, useCallback, useState } from 'react';

export interface StepProps {
  name: string;
  children: ReactNode;
}

export interface FunnelProps {
  children: Array<ReactElement<StepProps>>;
}

type UseFunnelReturn<T> = {
  Funnel: (props: FunnelProps) => ReactElement;
  Step: (props: StepProps) => ReactElement;
  currentStep: T;
  nextClickHandler: (nextStep: T) => void;
  prevClickHandler: (prevStep: T) => void;
};

export default function useFunnel<T>(initialStep: T): UseFunnelReturn<T> {
  const [step, setStep] = useState(initialStep);

  const Step = useCallback((props: StepProps): ReactElement => {
    return <>{props.children}</>;
  }, []);

  const Funnel = useCallback(
    ({ children }: FunnelProps) => {
      const targetStep = children.find((childStep) => childStep.props.name === step);

      return <>{targetStep}</>;
    },
    [step],
  );

  const nextClickHandler = (nextStep: T) => setStep(nextStep);
  const prevClickHandler = (prevStep: T) => setStep(prevStep);

  return {
    Funnel,
    Step,
    currentStep: step,
    nextClickHandler,
    prevClickHandler,
  } as const;
}
