<?
class LoginAttempts {
    private $db = "";
    public $IP = "";

    public function __construct($IP,$db) {
        $this->db = $db;
        $this->IP = $IP;
        return true;
    }
    public function getAttempts() {
        $IP = $this->IP;
        $db = $this->db;

        $getAttempts = $db->query("SELECT `attempts` FROM `login_attempts` WHERE `IP`='$IP' AND `date`>UNIX_TIMESTAMP()");

        if (!$getAttempts) return false;
        if ($getAttempts->num_rows == 0) return 0;

        $Attempts = $getAttempts->fetch_assoc();
        return $Attempts["attempts"];
    }
    public function getDate() {
        $IP = $this->IP;
        $db = $this->db;

        $getDate = $db->query("SELECT `date` FROM `login_attempts` WHERE `IP`='$IP' AND `date`>UNIX_TIMESTAMP()");

        if (!$getDate) return false;
        if ($getDate->num_rows == 0) return 0;

        $Date = $getDate->fetch_assoc();
        return $Date["date"];
    }
    public function addAttempt() {
        $IP = $this->IP;
        $db = $this->db;
        $currentAttempts = $this->getAttempts();
        $return = "";

        if ($currentAttempts == 0) {
            $query = "INSERT INTO `login_attempts` (`ip`,`date`) VALUES ('$IP',UNIX_TIMESTAMP() + 900)";
            $return = true;
        }
        else if ($currentAttempts != 3){
            $query = "UPDATE `login_attempts` SET `attempts`=`attempts` + 1, `date`=UNIX_TIMESTAMP() + 900 WHERE `IP`='$IP'";
            $return = ($currentAttempts + 1);
        }
        else {
            $query = "DELETE FROM `login_attempts` WHERE `IP`='$IP';INSERT INTO `login_attempts` (`ip`,`date`) VALUES ('$IP',,UNIX_TIMESTAMP() + 900)";
            $return = 1;
        }

        $addAttempt = $db->query($query);

        if (!$addAttempt) return false;
        else return $return;
    }
    public function deleteAttempts() {
        $IP = $this->IP;
        $db = $this->db;

        $deleteAttempts = $db->query("DELETE FROM `login_attempts` WHERE `IP`='$IP'");
        if ($deleteAttempts) return true;
        else return false;
    }
    public function Update() {
        $IP = $this->IP;
        $db = $this->db;
        $currentAttempts = $this->getAttempts();

        if ($currentAttempts == 0) return false;

        $update = $db->query("UPDATE `login_attempts` SET `date`=`date` + 900 WHERE `ip`='$IP'");
        if (!$update) return false;
        else return true;
    }
}