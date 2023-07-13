import { Layout } from "react-admin";
import { Mymenu } from "./myMenu";

export const MyLayout = (props: any) => <Layout {...props} menu={Mymenu} />;
