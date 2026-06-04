import OrderService from "../../services/order.service.js";

const createOrder = async (req, res) => {
  try {
    const order = await OrderService.createOrder(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTimeline = async(req, res) =>{
    
}

const getOrder = async(req, res) =>{

}

export default createOrder;
