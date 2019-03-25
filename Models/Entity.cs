using Microsoft.WindowsAzure.Storage.Table;

namespace Squalrus.Function.Models
{
    public class Entity : TableEntity
    {
        public string FriendlyDate => Timestamp.DateTime.ToString("MMMM dd, yyyy");
        public string Comment { get; set; }
        public string Title { get; set; }
        public string Metadata { get; set; }
        public string Image => $"{RowKey}.png";

    }
}
