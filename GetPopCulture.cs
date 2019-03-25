using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Linq;
using Squalrus.Function.Models;

namespace Squalrus.Function
{
    public static class GetPopCulture
    {
        [FunctionName("popculture")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            [Table("popculture")] CloudTable cloudTable,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            TableQuery<Entity> rangeQuery = new TableQuery<Entity>().Where(
                TableQuery.GenerateFilterConditionForDate("Timestamp", QueryComparisons.GreaterThanOrEqual, DateTimeOffset.UtcNow.AddMonths(-3))
            );

            List<Entity> entities = new List<Entity>();
            foreach (Entity entity in await cloudTable.ExecuteQuerySegmentedAsync(rangeQuery, null))
            {
                entities.Add(entity);
                log.LogInformation($"{entity.PartitionKey}\t{entity.RowKey}\t{entity.Timestamp}");
            }

            return new JsonResult(entities.OrderByDescending(x => x.Timestamp));
        }
    }
}
