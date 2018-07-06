<?php
/**
 * Created by PhpStorm.
 * User: Vladimir
 * Date: 02.07.2018
 * Time: 7:03
 */
 foreach($test as $item):?> // проходимся по массиву test

<!--    <p>--><?php //echo $item['title'];?><!--</p> // выводим название статьи-->
<!--    <p>--><?php //echo $item['text'];?><!--</p> // выводим текст статьи-->
    <p><?php echo $item['id'];?></p> //выводим дату добавления статьи

<?php endforeach;?> 