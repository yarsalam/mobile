import { startPayment } from "../../lib/payment";
import CustomButton from "../CustomButtonProps";

export const PaywallActionButton = ({ action, primary }) => {
  const onPress = () => {
    startPayment(action.product, action.productId);
    track('paywall_click', action);
  };

  return (
    <CustomButton
      label={action.label}
      onPress={onPress}
      gradient={primary || action.highlight}
    />
  );
};