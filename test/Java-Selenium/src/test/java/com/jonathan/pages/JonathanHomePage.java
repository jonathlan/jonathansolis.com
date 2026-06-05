package com.jonathan.pages;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


public class JonathanHomePage {
	WebDriver driver;
	WebDriverWait wait;
	
	public JonathanHomePage(WebDriver driver) 
	{
		this.driver = driver;
		PageFactory.initElements(this.driver, this);
		wait = new WebDriverWait(driver, Duration.ofSeconds(15));
	}
	
	// Elements
	@FindBy(how = How.XPATH, using = "//*[@id=\"main\"]//h1")
	WebElement heroTitle;

	@FindBy(how = How.XPATH, using = "//a[@data-testid='github-link']")
	WebElement relevantIcon;

	@FindBy(how = How.XPATH, using = "//div[@data-testid='social-icons']")
	WebElement icons;
	
	// Methods
	public boolean heroTitleFound()
	{
		wait.until(ExpectedConditions.
				visibilityOfElementLocated(By.xpath("//*[@id=\"main\"]//h1")));
		return true;
	}
	
	public boolean relevantIconURL()
	{
		// Social icons moved to Contact section — navigate there first
		WebElement contactDot = wait.until(ExpectedConditions.elementToBeClickable(
				By.cssSelector("[aria-label='Go to Contact']")));
		contactDot.click();
		wait.until(ExpectedConditions.visibilityOf(relevantIcon));
		if(relevantIcon.isEnabled())
			return true;
		return false;
	}
	
	public boolean validTitle(String expectedTitle)
	{
		String actualTitle = driver.getTitle();
		if (actualTitle.equalsIgnoreCase(expectedTitle))
			return true;
		else
			return false;
	}
	
	/**
	 * Validates that home page has the expected number of icons.
	 * @param numOfIcons The expected number of icons
	 * @return
	 * A boolean true if the number of icons in the homepage corresponds to numOfIcons,
	 *  false otherwise.
	 */
	public boolean hasEnoughIcons(int numOfIcons) {
		// Social icons moved to Contact section — navigate there first
		WebElement contactDot = wait.until(ExpectedConditions.elementToBeClickable(
				By.cssSelector("[aria-label='Go to Contact']")));
		contactDot.click();
		wait.until(ExpectedConditions.
				visibilityOfElementLocated(By.xpath("//div[@data-testid='social-icons']")));
		List<WebElement> actualIcons =
				icons.findElements(By.xpath("./a"));

		if(actualIcons.size() == numOfIcons)
			return true;
		else
			return false;
	}

}
