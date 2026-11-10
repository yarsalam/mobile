import {startPayment} from '../../lib/payment';
import type {PaywallAction} from '../../../types/paywall';
import CustomButton from '../CustomButtonProps';

interface Props {
  action: PaywallAction;
  primary?: boolean;
}

export const PaywallActionButton = ({action, primary = false}: Props) => {
  const onPress = () => startPayment(action.product, action.productId);

  return (
    <CustomButton
      label={action.label}
      onPress={onPress}
      gradient={primary || Boolean(action.highlight)}
    />
  );
};
