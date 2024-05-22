SELECT x.id_market, x.come_loss 
FROM public.property_new x 
where x.br_id = 998 and x.come_loss notnull 
order by 
	case
		when x.id_market = 'B12253' then 0
		else 1
	end,
	case
		when x.id_market = 'B12253' then null
		else x.come_loss 
	end desc
OFFSET 5 rows
FETCH NEXT 10 ROWS ONLY


/* -- จัดอันดับ -- */
select rank_num, user_name, score
from 
	(
	select 
		DENSE_RANK() OVER (ORDER BY score DESC) AS rank_num,
		user_name,
		score 
	from scores
	) as r 
where r.rank_num between 3 and 7