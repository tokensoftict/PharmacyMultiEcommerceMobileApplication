import { View } from "react-native";
import HeaderWithIcon from "@/shared/component/headerBack";
import { normalize } from "@/shared/helpers";
import CheckoutStepper from "@/shared/page/checkout/components/checkForm.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {GlobalProvider} from "@/shared/helpers/GlobalContext.tsx";
import {PAYSTACK_PUBLIC_KEY} from "@env";
import { PaystackProvider } from "react-native-paystack-webview/production/lib/PaystackProvider";




export default function Checkout() {

    return (
        <PaystackProvider publicKey={PAYSTACK_PUBLIC_KEY} currency="NGN">
        <GlobalProvider>
            <WrapperNoScroll >
                <HeaderWithIcon title={"CHECKOUT"} />
                <CheckoutStepper />
                <View style={{height: normalize(10)}} />
            </WrapperNoScroll>
        </GlobalProvider>
        </PaystackProvider>
    );
}
