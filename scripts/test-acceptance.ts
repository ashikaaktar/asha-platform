const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function runAcceptanceTests() {
  console.log("=== STARTING ASHA ACCEPTANCE TEST SUITE ===\n");
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string, extra?: any) {
    totalCount++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}`, extra || "");
    }
  }

  // TEST 1: Public Landing Page
  {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(res.status === 200, "1. Public Landing Page returns 200 OK");
    assert((html.includes("Build Your Website") || html.includes("আপনার স্বপ্নের ওয়েবসাইট")), "1.1 Landing page hero headline is present");
    assert((html.includes("How It Works") || html.includes("কীভাবে কাজ করে") || html.includes("সহজ ৩টি ধাপ")), "1.2 Landing page 'How It Works' section is present");
    assert((html.includes("Template Gallery") || html.includes("রেডি টেমপ্লেট গ্যালারি")), "1.3 Landing page 'Template Gallery' is present");
    assert((html.includes("Frequently Asked Questions") || html.includes("প্রশ্নোত্তর") || html.includes("সাধারণ জিজ্ঞাসা")), "1.4 Landing page FAQ section is present");
  }

  // TEST 2: Template Catalog API
  {
    const res = await fetch(`${BASE_URL}/api/templates`);
    const data = await res.json();
    assert(res.status === 200, "2. GET /api/templates returns 200 OK");
    assert(data.templates?.length >= 7, `2.1 Templates gallery has all categories (found ${data.templates?.length})`);
  }

  // TEST 3: User Registration
  const testUserEmail = `user_${Date.now()}@test.com`;
  let userCookie = "";
  let testUserId = "";
  {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Builder",
        email: testUserEmail,
        password: "Password123!",
      }),
    });
    const setCookie = res.headers.get("set-cookie") || "";
    userCookie = setCookie.split(";")[0];
    const data = await res.json();

    assert(res.status === 200, "3. User Registration succeeds");
    assert(data.user?.email === testUserEmail, "3.1 Returned registered user email matches");
    assert(data.user?.role === "USER", "3.2 New user role is USER");
    testUserId = data.user?.id;
  }

  // TEST 4: Session verification
  {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: userCookie },
    });
    const data = await res.json();
    assert(res.status === 200, "4. Session auth verification (/api/auth/me) succeeds");
    assert(data.user?.email === testUserEmail, "4.1 Session identifies correct logged-in user");
    assert(data.user?.planUsage?.planName === "Free", "4.2 User has default Free plan allocated");
  }

  // TEST 5: AI Website Generation
  let generatedWebsiteId = "";
  {
    const res = await fetch(`${BASE_URL}/api/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: userCookie,
      },
      body: JSON.stringify({
        name: "Quantum Cloud Studio",
        category: "Agency",
        description: "Next-gen distributed cloud infrastructure and AI application studio.",
        targetAudience: "Enterprise engineering teams",
        style: "Modern Blue Brand",
        multiPage: true,
        brandColor: "#2563EB",
        requiredSections: ["hero", "about", "features", "services", "contact", "footer"],
      }),
    });
    const data = await res.json();
    assert(res.status === 200, "5. AI Website Generation succeeds");
    assert(Boolean(data.website?.id), `5.1 Website created in database: id=${data.website?.id}`);
    assert(data.website?.pages?.length >= 3, `5.2 Multi-page structure generated (${data.website?.pages?.length} pages)`);
    generatedWebsiteId = data.website?.id;
  }

  // TEST 6: Fetch Website Details for Visual Editor
  {
    const res = await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}`, {
      headers: { Cookie: userCookie },
    });
    const data = await res.json();
    assert(res.status === 200, "6. GET /api/websites/[id] returns full website structure");
    assert(data.website?.name === "Quantum Cloud Studio", "6.1 Website name matches");
    assert(data.website?.pages[0]?.sections?.length >= 4, "6.2 Home page sections populated");
  }

  // TEST 7: Visual Editor - Update a Section
  const firstPage = (await (await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}`, { headers: { Cookie: userCookie } })).json()).website.pages[0];
  const firstSection = firstPage.sections[0];
  {
    const res = await fetch(
      `${BASE_URL}/api/websites/${generatedWebsiteId}/pages/${firstPage.id}/sections/${firstSection.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: userCookie,
        },
        body: JSON.stringify({
          content: {
            ...firstSection.content,
            heading: "Quantum Cloud — Customized Heading",
          },
          styles: {
            ...firstSection.styles,
            backgroundColor: "#FFFFFF",
          },
        }),
      }
    );
    const data = await res.json();
    assert(res.status === 200, "7. PUT update section succeeds");
    assert(
      data.section?.content?.heading === "Quantum Cloud — Customized Heading",
      "7.1 Heading was persisted in SQLite database"
    );
  }

  // TEST 8: Add a New Section
  {
    const res = await fetch(
      `${BASE_URL}/api/websites/${generatedWebsiteId}/pages/${firstPage.id}/sections`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: userCookie,
        },
        body: JSON.stringify({
          type: "faq",
        }),
      }
    );
    const data = await res.json();
    assert(res.status === 200, "8. Add Section to Page succeeds");
    assert(data.section?.type === "faq", "8.1 New section type is faq");
  }

  // TEST 9: Add a New Page
  {
    const res = await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: userCookie,
      },
      body: JSON.stringify({
        title: "Pricing Plans",
        slug: "pricing-plans",
      }),
    });
    const data = await res.json();
    assert(res.status === 200, "9. Add Page to Website succeeds");
    assert(data.page?.slug === "pricing-plans", "9.1 Page slug matches");
  }

  // TEST 10: Website Publishing to Subdomain
  const testSubdomain = `quantum-${Date.now().toString(36).slice(-4)}`;
  {
    const res = await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: userCookie,
      },
      body: JSON.stringify({ subdomain: testSubdomain }),
    });
    const data = await res.json();
    assert(res.status === 200, "10. Publish Website succeeds");
    assert(data.subdomain === testSubdomain, `10.1 Subdomain assigned: ${data.subdomain}`);
    assert(data.website?.status === "PUBLISHED", "10.2 Website status is PUBLISHED");
  }

  // TEST 11: Public Website Routing & Snapshot Integrity
  {
    const res = await fetch(`${BASE_URL}/api/public/site?subdomain=${testSubdomain}`);
    const data = await res.json();
    assert(res.status === 200, `11. Public site endpoint matches subdomain '${testSubdomain}'`);
    assert(data.snapshot?.name === "Quantum Cloud Studio", "11.1 Snapshot returns exact published website");
    assert(
      data.snapshot?.pages[0]?.sections[0]?.content?.heading === "Quantum Cloud — Customized Heading",
      "11.2 Snapshot preserves edited heading"
    );

    // Verify rendered HTML page
    const pageRes = await fetch(`${BASE_URL}/sites/${testSubdomain}`);
    const html = await pageRes.text();
    assert(pageRes.status === 200, `11.3 Public rendered HTML at /sites/${testSubdomain} returns 200`);
    assert(html.includes("Quantum Cloud Studio"), "11.4 Public HTML contains website name");
  }

  // TEST 12: Real Analytics Recording
  {
    const res = await fetch(`${BASE_URL}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        websiteId: generatedWebsiteId,
        pageSlug: "home",
        referrer: "https://google.com",
      }),
    });
    assert(res.status === 200, "12. Real analytics pageview event recorded");

    // Fetch analytics for website
    const statsRes = await fetch(`${BASE_URL}/api/analytics?websiteId=${generatedWebsiteId}`, {
      headers: { Cookie: userCookie },
    });
    const statsData = await statsRes.json();
    assert(statsData.totalViews >= 1, `12.1 Real analytics retrieved: totalViews=${statsData.totalViews}`);
  }

  // TEST 13: Subdomain Unpublishing
  {
    const res = await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}/unpublish`, {
      method: "POST",
      headers: { Cookie: userCookie },
    });
    const data = await res.json();
    assert(res.status === 200, "13. Unpublish Website succeeds");
    assert(data.website?.status === "DRAFT", "13.1 Status reverted to DRAFT");

    // Verify public site is now 404/offline
    const checkRes = await fetch(`${BASE_URL}/api/public/site?subdomain=${testSubdomain}`);
    assert(checkRes.status === 404, "13.2 Public site endpoint returns 404 when unpublished");
  }

  // TEST 14: Subdomain Isolation (verify 2 separate seeded subdomains)
  {
    const site1 = await (await fetch(`${BASE_URL}/api/public/site?subdomain=innovate`)).json();
    const site2 = await (await fetch(`${BASE_URL}/api/public/site?subdomain=portfolio`)).json();
    assert(site1.snapshot?.name === "Innovate AI Studio", "14.1 Subdomain 'innovate' returns Innovate AI Studio");
    assert(site2.snapshot?.name === "Creative Portfolio Showcase", "14.2 Subdomain 'portfolio' returns Portfolio Showcase");
    assert(site1.snapshot?.name !== site2.snapshot?.name, "14.3 Distinct subdomains never cross-pollinate");
  }

  // TEST 15: User Isolation (User B cannot access User A's private website)
  {
    // Register user B
    const userBRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "User B",
        email: `userB_${Date.now()}@test.com`,
        password: "Password123!",
      }),
    });
    const userBCookie = (userBRes.headers.get("set-cookie") || "").split(";")[0];

    // User B tries to view or edit User A's website
    const illegalAccessRes = await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}`, {
      headers: { Cookie: userBCookie },
    });
    assert(illegalAccessRes.status === 403, "15. User B blocked with 403 Forbidden when accessing User A's project");
  }

  // TEST 16: Super Admin Security
  {
    // Regular user tries to access /api/admin/stats
    const forbiddenRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: userCookie },
    });
    assert(forbiddenRes.status === 403, "16. Regular user blocked with 403 Forbidden from admin endpoints");

    // Login as Super Admin
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@asha.site",
        password: "Admin@Asha2026!",
      }),
    });
    const adminCookie = (adminLoginRes.headers.get("set-cookie") || "").split(";")[0];

    // Admin accesses /api/admin/stats
    const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: adminCookie },
    });
    const adminStats = await adminStatsRes.json();
    assert(adminStatsRes.status === 200, "16.1 Super Admin accesses /api/admin/stats with 200 OK");
    assert(adminStats.stats?.totalUsers >= 2, `16.2 Real user count reported: ${adminStats.stats?.totalUsers}`);
    assert(adminStats.stats?.totalWebsites >= 2, `16.3 Real website count reported: ${adminStats.stats?.totalWebsites}`);

    // Admin lists users
    const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Cookie: adminCookie },
    });
    const adminUsers = await adminUsersRes.json();
    assert(adminUsersRes.status === 200, "16.4 Super Admin can list all platform users");
    assert(adminUsers.users?.length >= 2, `16.5 User management active (${adminUsers.users?.length} users)`);
  }

  // TEST 17: User Plan & Quotas Management API
  {
    // Fetch plan usage
    const planRes = await fetch(`${BASE_URL}/api/user/plan`, {
      headers: { Cookie: userCookie },
    });
    const planData = await planRes.json();
    assert(planRes.status === 200, "17. GET /api/user/plan returns 200 OK");
    assert(planData.planUsage?.maxWebsites !== undefined, "17.1 Plan returns website limit");
    assert(planData.planUsage?.maxAiGenerations !== undefined, "17.2 Plan returns AI limit");

    // Upgrade to Pro
    const upgradeRes = await fetch(`${BASE_URL}/api/user/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: userCookie,
      },
      body: JSON.stringify({ planName: "Pro" }),
    });
    const upgradeData = await upgradeRes.json();
    assert(upgradeRes.status === 200, "17.3 POST /api/user/plan upgrade to Pro succeeds");
    assert(upgradeData.planUsage?.planName === "Pro", "17.4 Plan name updated to Pro");
    assert(upgradeData.planUsage?.maxWebsites === 10, "17.5 Website limit elevated to 10 for Pro");
  }

  // TEST 18: Analytics Query API with Breakdown
  {
    const analyticsRes = await fetch(`${BASE_URL}/api/analytics?websiteId=${generatedWebsiteId}`, {
      headers: { Cookie: userCookie },
    });
    const analyticsData = await analyticsRes.json();
    assert(analyticsRes.status === 200, "18. GET /api/analytics returns 200 OK");
    assert(Array.isArray(analyticsData.topPages), "18.1 Analytics includes topPages array");
    assert(Array.isArray(analyticsData.recentEvents), "18.2 Analytics includes recentEvents array");
  }

  // TEST 19: Standalone HTML Website Export
  {
    const exportRes = await fetch(`${BASE_URL}/api/websites/${generatedWebsiteId}/export`, {
      headers: { Cookie: userCookie },
    });
    const exportHtml = await exportRes.text();
    assert(exportRes.status === 200, "19. GET /api/websites/[id]/export returns 200 OK");
    assert(
      Boolean(exportRes.headers.get("content-type")?.includes("text/html")),
      "19.1 Export Content-Type is text/html"
    );
    assert(exportHtml.includes("<!DOCTYPE html>"), "19.2 Exported file is valid HTML document");
    assert(
      exportHtml.includes("Quantum Cloud"),
      "19.3 Exported HTML contains website content"
    );
  }

  console.log(`\n=== TEST SUITE COMPLETED: ${passedCount}/${totalCount} tests passed ===\n`);
  return { passedCount, totalCount, allPassed: passedCount === totalCount };
}

runAcceptanceTests()
  .then((res) => {
    if (!res.allPassed) process.exit(1);
    process.exit(0);
  })
  .catch((e) => {
    console.error("Test execution error:", e);
    process.exit(1);
  });
