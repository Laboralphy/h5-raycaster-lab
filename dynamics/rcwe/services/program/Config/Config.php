<?php
class Config implements O876\MVC\Config\Intf {
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Config\Intf::configLoader()
	 */
	public function configLoader(O876\Loader $oLoader) {
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Config\Intf::getPluginList()
	 */
	public function getPluginList() {
		return array(
			//new LoginPlugin()
		);
	}

	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Config\Intf::getDatabaseConfig()
	 */
	public function getDatabaseConfig() {
		return null;
	}
}
