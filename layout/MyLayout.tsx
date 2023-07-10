import { Layout } from "react-admin";
import { MyMenu } from "./myMenu";

export const MyLayout = (props: any) => <Layout {...props} menu={MyMenu} />;