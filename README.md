# vcSQL - A lightweight but easy-to-use sql wrapper for FiveM. #

vcSql only has 2 exports, (exec and transaction) exec is for singular use purposes and transaction is to execute a table of queries at once. 
Here is a quick example of using both of them.


>**Transaction**

RegisterCommand("denmefde", function(source)
    local table = {
     {"SELECT * FROM players", {}},
     {"DELETE FROM gls_whitelist WHERE hex = ?", {"PYL76366"}}
   };
    local executeDeneme = exports["vcSql"]:transaction(table)
    print(executeDeneme[1][1]["name"])
end)

>**Exec**

RegisterCommand("denmefde", function(source)
    local executeDeneme = exports["vcSql"]:exec("SELECT * FROM players")
    print(executeDeneme[1].inventory)
end)


For any further support you can  join our discord server over at https://discord.gg/BNtGTubF7E and open a ticket for help!
> vCode Team


