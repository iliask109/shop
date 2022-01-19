import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signout } from "../actions/userActions";

export default function Aside({ sidebarIsOpen, setSidebarIsOpen }) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();
  const closeAside = (e) => {
    console.log(e);
  };
  const signoutHandler = () => {
    dispatch(signout());
  };
  return (
    <aside
      className={sidebarIsOpen ? "open" : ""}
      onClick={(e) => closeAside(e.target)}
    >
      <ul className="categories">
        <li>
          <strong>שלום {userInfo?.name}</strong>
          <button
            onClick={() => setSidebarIsOpen(false)}
            className="close-sidebar"
            type="button"
          >
            <i className="fa fa-close"></i>
          </button>
        </li>
        {userInfo && (
          <ul>
            <h4>מידע אישי</h4>
            <li>
              <Link to="/profile">פרטי המשתמש</Link>
            </li>
            <li>
              <Link to="/orderhistory">הזמנות</Link>
            </li>
            <li>
              <Link to="/cart">
                סל קניות
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>
            </li>
          </ul>
        )}
        {userInfo && userInfo.isAdmin && (
          <ul>
            <h4>ניהול</h4>
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
          </ul>
        )}
        <h1 className="row center">
          {userInfo && (
            <li>
              <Link to="#signout" onClick={signoutHandler}>
                התנתק
              </Link>
            </li>
          )}
        </h1>
      </ul>

      {!userInfo && (
        <div>
          <Link to="/signin"> הכנס לאתר</Link>
          <div>
            משתמש חדש?
            <Link to={`/register`}>
              <br />
              צור משתמש בחינם
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
