<?
//Salt!
include "functions.php";

$Data = getData();

$Name = Clean($Data["name"]);
$Password = Clean($Data["password"]);
$Mobile = Clean($Data["mobile"]);

if (empty($Name) || empty($Password) || empty($Mobile)) {
    die(Response("لطفا همه فیلد ها را پر نمایید",false,-3));
}
if (mb_strlen($Password) < 6 || mb_strlen($Password) > 18) {
    $Re = strlen($Password) < 6 ? true : false;
    $ResD = $Re ? "کمتر" : "بیشتر";
    $ResC = $Re ? -101 : -102;
    die(Response("طول رمز عبور $ResD از حد مجاز است",false,$ResC));
}
if (!preg_match("/^09[0-3][0-9]{8,8}$/",$Mobile)) {
    die(Response("موبایل معتبر نمی‌باشد",false,-103));
}

$Password = md5(base64_encode($Password));
$Name = $db->real_escape_string($Name);
$Mobile = $db->real_escape_string($Mobile);
$Token = Token($Mobile);

$RepeatabilityCheck =  $db->query("SELECT * FROM `users` WHERE `mobile`='$Mobile'");
if ($RepeatabilityCheck->num_rows != 0) {
    die(Response("کاربر وجود دارد",false,-104));
}

$Signup = $db->query("INSERT INTO `users` (`name`,`mobile`,`password`,`date`) VALUES ('$Name','$Mobile','$Password',UNIX_TIMESTAMP())");
$IToken = $db->query("INSERT INTO `tokens` (`token`,`user`,`expiry_date`) VALUES ('$Token',{$db->insert_id},UNIX_TIMESTAMP() + $TokenExpireTime)");

if ($Signup && $IToken) {
    Response($Token,true,100,true);
}
else {
    Response("ثبت نام موفقیت آمیز نبود",false,-105,true);
}
