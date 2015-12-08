#!/bin/sh
# SCRIPT DE LANCEMENT DE SERVER NODE
# BASÉ SUR FW O876

NODE_JS="node"
PROGRAM_JS="index.js"
LOG_PATH="logs"
CONFIG_PATH="config"
STOPFILE="stop"

# lancement du serveur
runServer() {
	local sLogLastErr="$LOG_PATH/last-error.log"
	local sLogErr="$LOG_PATH/errors.log"
	local sLogServer="$LOG_PATH/server.log"
	if [ ! -d $LOG_PATH ]
	then
		echo "/!\ warning ! log directory not found. creating : $LOG_PATH"
		mkdir -p $LOG_PATH
	fi
	echo "-------------------------------------------------" >> $sLogServer
	# lancement du serveur avec récupération d'une eventuelle sortie erreur,
	# et sauvegarde de la sortie standard.
	echo " "
	$NODE_JS $PROGRAM_JS 2> $sLogLastErr | tee -a $sLogServer
	# affichage et archivage de la dernière erreur.
	if [ -f $sLogLastErr ]
	then
		cat $sLogLastErr
		echo "-------------------------------------------------" >> $sLogErr
		date >> $sLogErr
		cat $sLogLastErr >> $sLogErr
		rm $sLogLastErr
	fi
}

runServerForever() {
	echo "(i) server will restart forever (delete the '$STOPFILE' file to prevent this). "
	echo "1" > $STOPFILE
	while [ -f $STOPFILE ]
	do
		runServer
	done
}

stopForeverLoop() {
	if [ -f $STOPFILE ]
	then
		echo "(i) exiting forever loop"
		echo "(i) server will not automatically restart"
		rm $STOPFILE
	else
		echo "/!\ could not delete '$STOPFILE' : not found"
	fi
}

o876runservMain() {
	# type : screen -S "mwserver" -d -m bash runserver
	# for a bg running server
	if [ "$1" = "forever" ]
	then
		runServerForever
	else
		runServer
	fi
}

