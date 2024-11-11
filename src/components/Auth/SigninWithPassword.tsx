// SigninWithPassword.tsx
import React, { useState, FormEvent } from 'react';

interface SigninWithPasswordProps {
  onSubmit: (e: FormEvent) => Promise<void>;
}

const SigninWithPassword: React.FC<SigninWithPasswordProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default SigninWithPassword;
