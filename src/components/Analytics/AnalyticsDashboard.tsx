import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileTextIcon, MagnifyingGlassIcon, ChatBubbleIcon, ArrowUpIcon } from '@radix-ui/react-icons';

const searchData = [
  { name: 'Mon', searches: 24 },
  { name: 'Tue', searches: 45 },
  { name: 'Wed', searches: 32 },
  { name: 'Thu', searches: 67 },
  { name: 'Fri', searches: 89 },
  { name: 'Sat', searches: 34 },
  { name: 'Sun', searches: 23 },
];

const documentTypes = [
  { name: 'PDF', value: 45, color: 'hsl(var(--primary))' },
  { name: 'DOCX', value: 30, color: 'hsl(var(--accent))' },
  { name: 'TXT', value: 15, color: 'hsl(var(--secondary))' },
  { name: 'MD', value: 10, color: 'hsl(var(--muted))' },
];

const chatActivity = [
  { time: '9:00', messages: 5 },
  { time: '10:00', messages: 12 },
  { time: '11:00', messages: 8 },
  { time: '12:00', messages: 15 },
  { time: '13:00', messages: 22 },
  { time: '14:00', messages: 18 },
  { time: '15:00', messages: 25 },
];

const stats = [
  {
    title: 'Total Documents',
    value: '156',
    change: '+12%',
    icon: FileTextIcon,
    color: 'text-blue-500',
  },
  {
    title: 'Search Queries',
    value: '2,847',
    change: '+18%',
    icon: MagnifyingGlassIcon,
    color: 'text-green-500',
  },
  {
    title: 'Chat Messages',
    value: '1,234',
    change: '+24%',
    icon: ChatBubbleIcon,
    color: 'text-purple-500',
  },
  {
    title: 'Processing Time',
    value: '2.3s',
    change: '-8%',
    icon: ArrowUpIcon,
    color: 'text-orange-500',
  },
];

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your document processing and search performance
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card border-glass-border hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <Badge 
                    variant={stat.change.startsWith('+') ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.change} from last week
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
                <span>Search Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={searchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="searches" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Document Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileTextIcon className="w-5 h-5 text-primary" />
                <span>Document Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={documentTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {documentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chat Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChatBubbleIcon className="w-5 h-5 text-primary" />
              <span>Chat Activity (Today)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chatActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};