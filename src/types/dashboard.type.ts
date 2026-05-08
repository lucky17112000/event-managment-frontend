export interface NavItems {
  title?: string;
  href?: string;
  icon?: string;
}
export interface NavSection {
  title?: string;
  items: NavItems[];
}

export interface PieChartData {
  status: string;
  count: number;
}

export interface BarChartData {
  month: string | Date;
  count: number;
}

export interface IAdminDashboardData {
  appoinmentCount: number;
  doctorCount: number;
  patientCount: number;
  adminCount: number;
  userCount: number;
  paymentCount: number;
  pieChartData: PieChartData[];
  barChartData: BarChartData[];
  totalRideaue: number;
}

/*



 reviewCount,
    patientCount: patientCount.length,
    appoinmentCount,
    totalRideaue: totalRideaue._sum.amount || 0,
    appoinmentStatusDistribution: formattedAppointmentStatusDistribution,
*/
// export interface IDoctorDashboardData {
//   patientCount: number;
//   appoinmentCount: number;
//   totalRideaue: number;
//   appoinmentStatusDistribution: PieChartData[];
// }
