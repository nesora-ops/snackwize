-- A WhatsApp order often carries no address at all: the customer agrees it in
-- the chat, which is the default guest path. The Razorpay flow still requires
-- one (createOrderSchema keeps address mandatory), so only the column relaxes.
alter table orders alter column address drop not null;
