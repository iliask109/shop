import jwt from "jsonwebtoken";
import mg from "mailgun-js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Seller Token" });
  }
};
export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin/Seller Token" });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUM_API_KEY,
    domain: process.env.MAILGUM_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1>תודה שקנית אצלנו</h1>
    <p>
    הי ${order.user.name},</p>
    <p>סיימנו לעבד את ההזמנה שלך</p>
    <h2>[הזמנה מספר ${order._id}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td><strong>מוצר</strong></td>
    <td><strong>כמות</strong></td>
    <td><strong align="right">מחיר</strong></td>
    </thead>
    <tbody>
    ${order.orderItems
      .map(
        (item) => `
      <tr>
      <td>${item.name}</td>
      <td align="center">${item.qty}</td>
      <td align="right"> ₪${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join("\n")}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">מחיר המוצרים : </td>
    <td align="right"> ₪${order.itemsPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">מחיר עמלה : </td>
    <td align="right"> ₪${order.taxPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">מחיר משלוח : </td>
    <td align="right"> ₪${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2"><strong>סך הכל לתשלום : </strong></td>
    <td align="right"><strong> ₪${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="2">אופן תשלום:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    </table>
    <h2>כתובת למשלוח</h2>
    <p>
    ${order.shippingAddress.fullName},
    ${order.shippingAddress.address},<br/>
    ${order.shippingAddress.city},
    ${order.shippingAddress.country},
    ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>
    תודה על הקנייה. 
    </p>
    `;
};
