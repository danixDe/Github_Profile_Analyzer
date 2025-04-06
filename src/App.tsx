import {  useState } from 'react';
import { GithubIcon, Star, GitFork, BookOpen} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers: number;
  forks: number;
  html_url: string;
  language: string;
}
interface Commit {
  date: string;
  count: number;
}

function App() {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState<Repository[]>([]);
  const [commit, setCommit] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({ totalStars: 0, totalForks: 0 });

  const GitHubData = async () => {
    if (!username) {
      toast.error("Please enter a GitHub username first");
      return;
    }

    setLoading(true);
    try {
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      if (!reposResponse.ok) throw new Error('User not found');
      const reposData = await reposResponse.json();
      setRepos(reposData);

      const stats = reposData.reduce((acc: any, repo: Repository) => ({
        totalStars: acc.totalStars + repo.stargazers,
        totalForks: acc.totalForks + repo.forks,
      }), { totalStars: 0, totalForks: 0 });
      setUserStats(stats);

      const commitData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        count: Math.floor(Math.random() * 10),
      }));
      setCommit(commitData);

      toast.success("Found your GitHub profile!");
    } catch (error) {
      toast.error("Can't find that GitHub user");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-background text-text p-8 transition-colors duration-300">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col items-center justify-center text-center mb-12">
      <GithubIcon className="w-12 h-12 mb-2 text-secondary" />
      <h1 className="text-4xl font-bold text-white">GitHub Profile Analyzer</h1>
    </div>

    <div className="flex justify-center mb-12">
      <div className="relative max-w-md w-full">
        <Input
          className="pl-10 pr-4 py-2 rounded-full bg-surface border border-surface"
          placeholder="Type a GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && GitHubData()}
        />
        <button
          onClick={GitHubData}
          disabled={loading}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-secondary px-3 py-2.5 rounded-tr-full rounded-br-full text-sm hover:bg-secondary/80 transition"
          >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>



        {repos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 bg-surface border border-surface">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Repositories</h3>
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold mt-2">{repos.length}</p>
              </Card>
              <Card className="p-6 bg-surface border border-surface">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Total Stars</h3>
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-3xl font-bold mt-2">{userStats.totalStars}</p>
              </Card>
              <Card className="p-6 bg-surface border border-surface">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Total Forks</h3>
                  <GitFork className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold mt-2">{userStats.totalForks}</p>
              </Card>
            </div>

            <Card className="p-6 bg-surface border border-surface mb-12">
              <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={commit}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#f8fafc40" />
                    <YAxis stroke="#f8fafc40" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorCommits)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.map((repo) => (
                <HoverCard key={repo.id}>
                  <HoverCardTrigger asChild>
                    <Card className="p-6 bg-surface border border-surface cursor-pointer transition-all hover:bg-surface">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-primary">{repo.name}</h3>
                          <p className="text-sm text-text/70 mt-1">{repo.description || 'No description available'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-secondary mr-1" />
                            <span className="text-sm">{repo.stargazers}</span>
                          </div>
                          <div className="flex items-center">
                            <GitFork className="w-4 h-4 text-accent mr-1" />
                            <span className="text-sm">{repo.forks}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-surface border border-surface">
                    <div className="flex justify-between space-x-4">
                      <div>
                        <h4 className="text-sm font-semibold">{repo.name}</h4>
                        {repo.language && (
                          <p className="text-sm text-primary">
                            Primary Language: {repo.language}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-secondary hover:text-red-500"
                          >
                            View Repository
                          </a>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
