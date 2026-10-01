import axios from "axios";

const paystackApi = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

class PaystackService {
  static async initializeTransaction(payload) {
    const response = await paystackApi.post(
      "/transaction/initialize",
      payload,
    );

    return response.data;
  }

  static async verifyTransaction(reference) {
    const response = await paystackApi.get(
      `/transaction/verify/${reference}`,
    );

    return response.data;
  }
}

export default PaystackService;