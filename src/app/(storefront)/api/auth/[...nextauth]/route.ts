import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { createClient } from "next-sanity";
import bcrypt from "bcryptjs";

// Create a client for fetching/creating users
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Make sure you have this in .env.local with write permissions
  apiVersion: "2023-01-01",
});

export const authOptions = {
  providers: [
    // 1. GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // 2. FACEBOOK
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // 3. CREDENTIALS (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Fetch user from Sanity
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user || !user.password) {
          throw new Error("User not found or registered via social provider");
        }

        // Verify Password
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      }
    })
  ],
  callbacks: {
    // Intercept SignIn to auto-create OAuth users in Sanity
    async signIn({ user, account }: any) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Check if user already exists in Sanity
          const existingUser = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: user.email }
          );

          // If they don't exist, create them in Sanity automatically
          if (!existingUser) {
            await client.create({
              _type: "user",
              email: user.email,
              name: user.name,
              role: "customer", // Assign default role
              provider: account.provider, // Track where they came from
            });
          }
          return true; // Allow login
        } catch (error) {
          console.error("Error creating OAuth user in Sanity:", error);
          return false; // Block login if DB fails
        }
      }
      return true; // Credentials logic handles its own validation
    },

    // Add role and ID to the JWT token
    async jwt({ token, user, account }: any) {
      if (user) {
        if (account?.provider === "google" || account?.provider === "facebook") {
            // For OAuth, fetch their role from Sanity since it's not in the Google/Facebook payload
            const sanityUser = await client.fetch(
                `*[_type == "user" && email == $email][0]`,
                { email: user.email }
            );
            token.role = sanityUser?.role || "customer";
            token.id = sanityUser?._id;
        } else {
            // For Credentials, we already passed role & id in authorize()
            token.role = user.role;
            token.id = user.id;
        }
      }
      return token;
    },

    // Add role and ID to the session (so client can access it)
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };