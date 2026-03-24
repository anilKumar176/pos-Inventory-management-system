const Invoice = ({ cart, total }) => {
  return (
    <div id="invoice" className="p-4 bg-white text-black w-80">

      <h2 className="text-center font-bold text-xl mb-2">
        Retail POS
      </h2>

      <p className="text-center text-sm mb-4">
        Thank You For Shopping
      </p>

      <hr />

      {cart.map((item) => (
        <div key={item._id} className="flex justify-between text-sm my-1">
          <span>{item.name} x {item.qty}</span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr className="my-2" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <p className="text-center text-xs mt-4">
        Visit Again!
      </p>
    </div>
  );
};

export default Invoice;
//manage products, add, edit, delete