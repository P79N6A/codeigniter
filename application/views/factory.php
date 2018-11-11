<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<?php
include("header.php");
?>
<?php echo $this->benchmark->elapsed_time().'<br>';?>
<?php echo $this->benchmark->memory_usage();?>
<body>

    <h1>Welcome to CodeIgniter <?php echo $data?>!</h1>
<?php $hi?>
    <script>
        var list = {
            value: 1,
            next: {
                value: 2,
                next: {
                    value: 3,
                    next: {
                        value: 4,
                        next: null
                    }
                }
            }
        };
    //Напишите функцию printList(list), которая выводит элементы списка по очереди, при помощи цикла.
    function printList(list) {
        var next_item = list.next;
        var value = list.value;
        while(list.next){
            document.write(value);
            if(next_item === null) {
                break;
            }
            value = next_item.value;


                next_item = next_item.next;
            }
        }
//    Напишите функцию printList(list) при помощи рекурсии.
    function printListRec(list){
        document .write(list.value);
        if(list.next){
            printListRec(list.next);
        }
    }

// Напишите функцию printReverseList(list), которая выводит элементы списка в обратном порядке, при помощи рекурсии.
// Для списка выше она должна выводить 4,3,2,1
    function printListRecRev(list){

        if(!list.next){
            printListRecRev(list.next);
            document .write(list.value);
        }

    }
//    printList(list);
printListRecRev(list);
    </script>


</body>
</html>