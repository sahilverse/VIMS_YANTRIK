using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(AppDbContext context) : base(context) { }
    }
}



