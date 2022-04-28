import { MdDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsCart2, BsLink45Deg } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";


const data = [
    {
        title: "Dashboard",
        icon: <MdDashboard className="icon" />,
        path: "/dashboard",
    },
    {
        title: "Orders",
        icon: <MdOutlineShoppingBag className="icon" />,
        path: "/orders",
    },
    {
        title: "Products",
        icon: <BsCart2 className="icon" />,
        path: "/products",
    },
    {
        title: 'Categories',
        icon: <BiCategory className="icon" />,
        path: '/categories'
    },
    {
        title: "customers",
        icon: <FaUsers className="icon" />,
        path: "/customers",
    },
    {
        title: "storefront!",
        icon: <BsLink45Deg className="icon" />,
        path: "/",
    },
];

export default data;