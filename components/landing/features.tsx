import { Database, MapPin, FileText, TrendingUp, Clock, Layers } from "lucide-react"

export function LandingFeatures() {
  const features = [
    {
      icon: Database,
      title: "Inventory Management",
      description: "Track fuel stock levels with dip readings, received quantities, and automated calculations.",
    },
    {
      icon: MapPin,
      title: "GPS Attendance",
      description: "Staff can check in only within the designated pump radius using location verification.",
    },
    {
      icon: FileText,
      title: "Export Reports",
      description: "Download sales and inventory reports in PDF or Excel format for easy record-keeping.",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Visual insights into sales performance, fuel consumption patterns, and revenue trends.",
    },
    {
      icon: Clock,
      title: "Shift Management",
      description: "Organize morning, evening, and night shifts with automatic sales attribution.",
    },
    {
      icon: Layers,
      title: "Multi-Pump Support",
      description: "Super Admins can manage multiple pump locations from a single dashboard.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">Everything You Need to Run Your Pump</h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed specifically for petrol pump operations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="mb-4 inline-flex rounded-lg bg-secondary p-3">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
