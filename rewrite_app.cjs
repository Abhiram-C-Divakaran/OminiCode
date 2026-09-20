const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove LoginPage and RegisterPage imports
content = content.replace(/import LoginPage from '\.\/components\/pages\/LoginPage';\n/g, '');
content = content.replace(/import RegisterPage from '\.\/components\/pages\/RegisterPage';\n/g, '');

// Remove Route Guards since we are making everything public
const oldGuards = `// Route Guards
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`;
content = content.replace(oldGuards, '');

// Update Routes mapping
const oldRoutes = `<Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                  {/* Private authenticated paths */}
                  <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/editor" element={<WorkspacePage />} />
                    <Route path="/ai-chat" element={<AIChatPage />} />
                    <Route path="/analytics" element={<AnalyticsPage onNavigate={() => {}} />} />
                    <Route path="/account" element={<AccountPage />} />
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>`;

const newRoutes = `<Routes>
                  <Route path="/" element={<LandingPage />} />

                  {/* App Layout */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/editor" element={<WorkspacePage />} />
                    <Route path="/ai-chat" element={<AIChatPage />} />
                    <Route path="/analytics" element={<AnalyticsPage onNavigate={() => {}} />} />
                    <Route path="/account" element={<AccountPage />} />
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>`;

content = content.replace(oldRoutes, newRoutes);
fs.writeFileSync('src/App.tsx', content);
