# h5-raycaster-lab

A framework and a set of tools aimed at building HTML 5 raycasting based games.


## Project structure

/libraries : contains all the raycasting engine libraries.

/sources : contains all the game or demo projects. The projects located here references the /libraries folder. This folder contains some examples.

/modules : the PACKED version of game or demo projects (packed from the corresponding /sources project). Each modules is a standalone javascript program (including all required classes) and doesn't need the /libraries folder any longer. Each packed project has an index.html, a stylesheet, a single javascript file, and a folder named "resources" and containing all the assets.  

/servers : some special projects are multiplayer games, this folder contains the server programs written in node.js (so node.js is required for this program to work and must be installed on the system running the project).

/dynamics : these are dynamics pages or services written in PHP or javascript. The editor is located here. The project packer is also located here. The random dungeon generator too.... These tools helps quickly building games.


