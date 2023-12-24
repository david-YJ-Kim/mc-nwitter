import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
        <h2>layout</h2>
        <Outlet />          {/*  Home Compoenet will be rendered.*/}
        </>
    );
}