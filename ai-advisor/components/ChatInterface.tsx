'use client';

import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/app/page';

type ChatInterfaceProps = {
	messages: Message[];
	onSendMessage: (message: string) => void;
	isLoading: boolean;
};

export default function ChatInterface({
	messages,
	onSendMessage,
	isLoading,
}: ChatInterfaceProps) {
	const [input, setInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim() && !isLoading) {
			onSendMessage(input.trim());
			setInput('');
		}
	};

	return (
		<div
			style={{
				width: '100%',
				maxWidth: '600px',
				background: 'white',
				borderRadius: '12px',
				boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
				display: 'flex',
				flexDirection: 'column',
				height: '500px',
			}}
		>
			{/* Messages */}
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					padding: '1rem',
				}}
			>
				{messages.length === 0 && (
					<p
						style={{
							color: '#999',
							textAlign: 'center',
							marginTop: '2rem',
						}}
					>
						Send a message to start chatting!
					</p>
				)}
				{messages.map((msg, i) => (
					<div
						key={i}
						style={{
							marginBottom: '1rem',
							display: 'flex',
							justifyContent:
								msg.role === 'user' ? 'flex-end' : 'flex-start',
						}}
					>
						<div
							style={{
								maxWidth: '80%',
								padding: '0.75rem 1rem',
								borderRadius: '12px',
								background:
									msg.role === 'user' ? '#007bff' : '#e9ecef',
								color: msg.role === 'user' ? 'white' : 'black',
							}}
						>
							{msg.content}
						</div>
					</div>
				))}
				{isLoading && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-start',
						}}
					>
						<div
							style={{
								padding: '0.75rem 1rem',
								borderRadius: '12px',
								background: '#e9ecef',
								color: '#666',
							}}
						>
							Thinking...
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<form
				onSubmit={handleSubmit}
				style={{
					display: 'flex',
					padding: '1rem',
					borderTop: '1px solid #eee',
					gap: '0.5rem',
				}}
			>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Type a message...'
					disabled={isLoading}
					style={{
						flex: 1,
						padding: '0.75rem',
						borderRadius: '8px',
						border: '1px solid #ddd',
						fontSize: '1rem',
					}}
				/>
				<button
					type='submit'
					disabled={isLoading || !input.trim()}
					style={{
						padding: '0.75rem 1.5rem',
						borderRadius: '8px',
						border: 'none',
						background: '#007bff',
						color: 'white',
						fontSize: '1rem',
						cursor:
							isLoading || !input.trim()
								? 'not-allowed'
								: 'pointer',
						opacity: isLoading || !input.trim() ? 0.6 : 1,
					}}
				>
					Send
				</button>
			</form>
		</div>
	);
}
