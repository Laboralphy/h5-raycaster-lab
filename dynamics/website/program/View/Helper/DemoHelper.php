<?php
class DemoHelper extends O876\MVC\View\Helper {
	public function Demo() {
		$aDemo = '';
		foreach (scandir('../../modules/') as $demo) {
			if (file_exists('../../modules/' . $demo . '/thumbnail.png')) {
				$aDemo[] = '"../../modules/' . $demo . '/thumbnail.png" (btn "../../modules/' . $demo . '/" "' . $demo . '")';
			}
		}
		$sCode = '(imgrow "lg-3 md-4 sm-6 xs-12" ' . implode("\n", $aDemo) . ')';
		return $this->Lysp($sCode);
	}
}
