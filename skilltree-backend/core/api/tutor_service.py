import environ
import os
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from .models import ChatMessage as ChatMessageModel

env = environ.Env()
environ.Env.read_env(os.path.join(settings.BASE_DIR, '.env'))


class DjangoChatMessageHistory(BaseChatMessageHistory):
    """
    Bridges LangChain's message history interface to our ChatMessage model,
    scoped to one (user, topic) conversation.
    """

    def __init__(self, user, topic):
        self.user = user
        self.topic = topic

    @property
    def messages(self):
        rows = ChatMessageModel.objects.filter(user=self.user, topic=self.topic)
        result = []
        for row in rows:
            if row.role == 'user':
                result.append(HumanMessage(content=row.content))
            else:
                result.append(AIMessage(content=row.content))
        return result

    def add_message(self, message):
        role = 'user' if isinstance(message, HumanMessage) else 'assistant'
        ChatMessageModel.objects.create(user=self.user, topic=self.topic, role=role, content=_extract_text(message.content))

    def clear(self):
        ChatMessageModel.objects.filter(user=self.user, topic=self.topic).delete()


def get_tutor_response(user, topic, progress, user_message):
    """
    progress: a UserTopicProgress instance (or None if not enrolled)
    Returns the assistant's reply text.
    """
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        google_api_key=env('GOOGLE_API_KEY'),
        temperature=0.5,
    )

    status = progress.status if progress else 'not started'
    completion = progress.completion_pct if progress else 0

    system_prompt = f"""You are a friendly, encouraging tutor helping a student learn "{topic.name}".
    Topic description: {topic.description}
    Student's current status on this topic: {status}
    Student's completion: {completion}%

    Answer their questions clearly, adapt your explanations to a student at this stage,
    and keep responses focused and not overly long. If completion is low, be extra patient
    with fundamentals. If completion is high, you can go deeper or suggest practice problems.

    Format your responses in plain Markdown (bold, headers, bullet lists, code blocks are fine).
    Do NOT use LaTeX notation (no $ symbols for math) — write mathematical notation in plain text
    or code format instead, e.g. write "Sigma" or `Σ` rather than "$\\Sigma$".
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ])

    chain = prompt | llm

    def get_history(session_id):
        return DjangoChatMessageHistory(user=user, topic=topic)

    chain_with_history = RunnableWithMessageHistory(
        chain,
        get_history,
        input_messages_key="input",
        history_messages_key="history",
    )

    response = chain_with_history.invoke(
        {"input": user_message},
        config={"configurable": {"session_id": f"{user.id}-{topic.id}"}},
    )
    return _extract_text(response.content)

def _extract_text(content):
    if isinstance(content, list):
        text_parts = [block.get('text', '') for block in content if isinstance(block, dict) and block.get('type') == 'text']
        return ''.join(text_parts)
    return content