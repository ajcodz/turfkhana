import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import axios from "axios";

function generateRandomString(length: number = 4): string {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
}

async function getAccessToken(
  merchantId: string,
  securedKey: string,
  basketId: string,
  transAmount: string,
  currencyCode: string,
): Promise<string> {
  const tokenApiUrl =
    "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken";

  const params = new URLSearchParams({
    MERCHANT_ID: merchantId,
    SECURED_KEY: securedKey,
    BASKET_ID: basketId,
    TXNAMT: transAmount,
    CURRENCY_CODE: currencyCode,
  });

  const response = await axios.post(tokenApiUrl, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data?.ACCESS_TOKEN ?? "";
}

export const initiateTransaction = catchAsync(async (req, res) => {
  const {
    transAmount,
    currencyCode = "PKR",
    customerEmail,
    customerMobile,
    successUrl,
    failureUrl,
    checkoutUrl,
    items,
  } = req.body;

  const merchantId = "247894";
  const securedKey = "svSN5fOef3kxlLH8VxifK_JBNJ";
  const basketId = `FLUX-${generateRandomString(4)}`;

  const token = await getAccessToken(
    merchantId,
    securedKey,
    basketId,
    transAmount,
    currencyCode,
  );

  if (!token)
    return res
      .status(400)
      .json({ error: "Failed to retrieve access token from PayFast" });

  const payload = {
    CURRENCY_CODE: currencyCode,
    MERCHANT_ID: merchantId,
    MERCHANT_NAME: "Payfast Merchant",
    TOKEN: token,
    BASKET_ID: basketId,
    TXNAMT: transAmount,
    ORDER_DATE: new Date().toISOString().replace("T", " ").substring(0, 19),
    SUCCESS_URL: successUrl,
    FAILURE_URL: failureUrl,
    CHECKOUT_URL: checkoutUrl,
    CUSTOMER_EMAIL_ADDRESS: customerEmail,
    CUSTOMER_MOBILE_NO: customerMobile,
    SIGNATURE: "SOMERANDOM-STRING",
    VERSION: "MERCHANTCART-0.1",
    TXNDESC: "Item Purchased from Cart",
    PROCCODE: "00",
    TRAN_TYPE: "ECOMM_PURCHASE",
    STORE_ID: "",
    MERCHANT_USERAGENT:
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
    ITEMS: items ?? [],
  };

  res.status(200).json({ payload });
});
