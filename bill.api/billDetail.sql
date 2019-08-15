select bill.date_time,
       bill.money,
       bill.bill_desc,
       bbt2.name as bill_type_name,
       card.name as card_name,
       bu.name   as card_user_name,
       c.name    as target_card_name,
       bbt2.type bill_type_type,
       u.name    as target_card_user_name
from bd_bill bill
       left join bd_bill_transfer bbt on bill.id = bbt.bill_id
       left join bc_bill_type bbt2 on bill.bill_type_id = bbt2.id
       left join bc_user user2 on bill.user_id = user2.id
       left join bc_card card on bill.card_id = card.id
       left join bc_user bu on card.user_id = bu.id
       left join bc_card c on bbt.target_card_id = c.id
       left join bc_user u on c.user_id = u.id
order by bill.date_time desc