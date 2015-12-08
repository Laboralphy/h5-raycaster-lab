<?php
header('text/plain');
http_response_code(500);
print 'error: ' . $this->error->getMessage();
