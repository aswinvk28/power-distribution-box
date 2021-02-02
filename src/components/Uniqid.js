import MD5 from "crypto-js/md5";

export default function Uniqid(name) {
    const now = new Date();
    return MD5(name + "/" + now.getTime().toString()).toString();
}