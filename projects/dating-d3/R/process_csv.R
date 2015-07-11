######################
# Load Packages
######################
require(ggplot2)
require(reshape2)
require(scales)
require(jsonlite)
require(data.table)
require(plyr)


######################
### Load & Clean Data
######################
# Assumes data can be found in ../data from R working directory (location of script)
dating = data.table(read.csv('../data/Dating.csv', stringsAsFactors = FALSE))

agg_columns = c('use_internet', 'use_email', 'use_reddit', 'use_social_networking', 'use_twitter','used_dating_site')

for(col in agg_columns){
  if(col == agg_columns[1]){
    agg_dt = dating[,list(count=.N, variable=col),by=list(age, eval(parse(text=col)))]  
  }else{
    agg_dt = rbind(agg_dt, dating[,list(count=.N, variable=col),by=list(age, eval(parse(text=col)))])
  }
}
agg_dt[,response:=parse]

agg_dt = agg_dt[response %in% c('Yes', 'No')]

agg = dcast(agg_dt, age + variable ~ response, value.var = 'count', fill=0)
agg$YesPct = agg$Yes / (agg$Yes + agg$No)

agg4json = split(agg[,c('age','Yes','No', 'YesPct')], agg$variable)

write(toJSON(agg, pretty=T), '../data/Digital.json')
#write(toJSON(agg4json, pretty=T), '../data/Digital.json')

agg4csv = dcast(agg, age~variable, value.var='YesPct', fill=0)
write.csv(agg4csv, '../data/Digital.csv', row.names=F)

