import { Layout } from "react-admin";
import { Mymenu } from "./myMenu";
import { MyAppBar } from "./myAppBar"

export const MyLayout = (props: any) => <Layout {...props} menu={Mymenu} appBar={MyAppBar}/>;
