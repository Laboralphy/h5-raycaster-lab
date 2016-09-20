<?php
header('content-type: text/plain');
print 'error: ' . $this->error->getMessage() . "\n";
print($this->error->getTraceAsString());
