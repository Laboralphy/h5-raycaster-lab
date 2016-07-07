<?php
class LabyRoom extends RoomGenerator {
	public $oPeri;
	protected $aData = array();
	
	public function __construct() {
		$this->oPeri = new RoomGenerator();
	}
	
	public function setSize($w, $h) {
		parent::setSize ($w - 2, $h - 2);
		$this->oPeri->setSize ($w, $w);
	}
	
	public function setRoomData($a, $v = null) {
		if (is_array($a)) {
			$this->aData = $a;
		} else {
			$this->aData[$a] = $v;
		}
	}
	public function getRoomData($s = null) {
		if ($s) {
			return $this->aData[$s];
		} else {
			return $this->aData;
		}
	}
	
	public function getPeri() {
		return $this->oPeri;
	}
}
