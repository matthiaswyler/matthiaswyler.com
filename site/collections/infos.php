<?php

return function ($site) {
  return $site
    ->find('infos')
    ->children()
    ->listed()
    ->flip();
};
