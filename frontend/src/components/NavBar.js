import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signout } from "../actions/userActions";

export default function NavBar() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;


  return (
    <div>
      {userInfo ? (
        <div className="dropdown">
          <Link to="#">
            {userInfo.name} <i className="fa fa-caret-down"></i>
          </Link>
          <ul className="dropdown-content">
            <li>
              <Link to="/profile">פרטי המשתמש</Link>
            </li>
            <li>
              <Link to="/orderhistory">הזמנות</Link>
            </li>
            <li>
              <Link to="#signout" onClick={signoutHandler}>
                התנתק
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <Link to="/signin">הכנס</Link>
      )}
      {userInfo && userInfo.isSeller && (
        <div className="dropdown">
          <Link to="#admin">
            מוכר <i className="fa fa-caret-down"></i>
          </Link>
          <ul className="dropdown-content">
            <li>
              <Link to="/productlist/seller">מוצרים</Link>
            </li>
            <li>
              <Link to="/orderlist/seller">הזמנות</Link>
            </li>
          </ul>
        </div>
      )}

      {userInfo && userInfo.isAdmin && (
        <div className="dropdown">
          <Link to="#admin">
            ניהול <i className="fa fa-caret-down"></i>
          </Link>
          <ul className="dropdown-content">
            <li>
              <Link to="/dashboard">סיכום</Link>
            </li>
            <li>
              <Link to="/productlist">מוצרים</Link>
            </li>
            <li>
              <Link to="/orderlist">הזמנות</Link>
            </li>
            <li>
              <Link to="/userlist">משתמשים</Link>
            </li>
            <li>
              <Link to="/support">צאט</Link>
            </li>
          </ul>
        </div>
      )}
      <Link to="/cart">
        סל קניות
        {cartItems.length > 0 && (
          <span className="badge">{cartItems.length}</span>
        )}
      </Link>
    </div>
  );
}
