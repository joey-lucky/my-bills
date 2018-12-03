-- 查询表结构
select t.TABLE_NAME,
       t.COLUMN_NAME,
       t.COLUMN_KEY
from information_schema.columns t
where table_schema = 'bill';