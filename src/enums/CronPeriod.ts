export enum CronPeriod {
  EVERY_MINUTE = '* * * * *',
  HOURLY = '0 * * * *',
  DAILY = '0 0 * * *',
  WEEKLY = '0 0 * * 0',
  MONTHLY = '0 0 1 * *'
}