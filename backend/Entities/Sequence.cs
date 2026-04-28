using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Sequence : BaseEntity
    {
        public SequenceType Type { get; set; }
        public int LastNumber { get; set; }
    }
}



